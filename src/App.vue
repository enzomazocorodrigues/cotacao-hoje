<template>
  <v-app>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container class="fill-height">
        <v-card class="mx-auto" width="800px">
          <v-card-title>
            <v-row no-gutters justify="space-between" align="baseline">
              <v-col cols="6">
                <span class="title" >{{ dataFormataExtenso(new Date()) }}</span>
              </v-col>
              <v-col cols="5" align="end">
                <v-select
                  v-model="currency"
                  @change="getCurrency"
                  :items="currencies"
                  dense
                  label="Moeda"
                  solo
                ></v-select>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-if="currencyPrices.length">
            <div>
              <span class="mr-1 text-h6">R$</span>
              <span class="text-h3">{{ currencyPrices[0].ask }}</span>
            </div>
            <span class="text-caption">{{ dataFormataRelativa(parseISO(this.currencyPrices[0].create_date)) }}</span>
          </v-card-text>
          <v-card-text v-if="currencyPrices.length">
            <v-sparkline
              auto-draw
              color="green"
              :value="currencyPricesAvg"
              :labels="currencyPricesAvg.map(price => `R$ ${price.toFixed(4)}`)"
              padding="16"
              line-width="2"
            >
            </v-sparkline>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text v-if="currencyPrices.length">
            <v-row no-gutters justify="space-between">
              <span>mínima</span>
              <span class="ml-3">máxima</span>
              <span>variação</span>
            </v-row>
            <v-row no-gutters justify="space-between">
              <span class="font-weight-medium">R$ {{ currencyPrices[0].low }}</span>
              <span class="font-weight-medium">R$ {{ currencyPrices[0].high }}</span>
              <span :class="`font-weight-medium ${currencyPrices[0].pctChange < 0 ? 'red--text' : ''}`">{{ currencyPrices[0].pctChange }}%</span>
            </v-row>
          </v-card-text>
          <v-card-text class="text-center" v-else>
            <div>
              <v-icon color="red" x-large>mdi-alert-outline</v-icon>
            </div>
            <span class="red--text">
              Ocorreu um erro
            </span>
          </v-card-text>
        </v-card>
        <v-card class="mx-auto mt-6" width="800px">
          <v-data-table
            :headers="headers"
            :items="currencyPrices"
            items-per-page="8"
            hide-default-footer
          >
            <template v-slot:item.timestamp="{ item }">
                <!-- {{ format(item.create_date, 'dd/MM/yyyy') }} -->
                {{ format(parseISO(item.create_date), 'dd/MM/yyyy') }}
            </template>
            <template v-slot:item.bid="{ item }">
                R$ {{ item.bid }}
            </template>
            <template v-slot:item.ask="{ item }">
                R$ {{ item.ask }}
            </template>
            <template v-slot:item.varBid="{ item }">
              <span :class="item.varBid < 0 ? 'red--text' : ''">
                R$ {{ item.varBid }}
              </span>
            </template>
            <template v-slot:item.pctChange="{ item }">
              <span :class="item.pctChange < 0 ? 'red--text' : ''">
                {{ item.pctChange }}%
              </span>
            </template>
            <template v-slot:item.high="{ item }">
                R$ {{ item.high }}
            </template>
            <template v-slot:item.low="{ item }">
                R$ {{ item.low }}
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import mixinData from '@/mixins/mixinData.js'
export default {
  name: 'App',
  mixins: [mixinData],
  data() {
    return {
      baseApiUrl: 'https://economia.awesomeapi.com.br/json/daily',
      time: 8,
      currencyPrices: [],
      currency: "USD-BRL",
      headers: [
        {
          text: "Moeda",
          value: 'code'
        },
        {
          text: "Data",
          value: 'timestamp'
        },
        {
          text: "Compra",
          value: 'bid'
        },
        {
          text: "Venda",
          value: 'ask'
        },
        {
          text: "Variação",
          value: 'varBid'
        },
        {
          text: "Variação (%)",
          value: 'pctChange'
        },
        {
          text: "Máximo",
          value: 'high'
        },
        {
          text: "Mínimo",
          value: 'low'
        },
      ],
      currencies: [
        {
          text: "Dólar Comercial",
          value: "USD-BRL"
        },
        {
          text: "Dólar Canadense",
          value: "CAD-BRL"
        },
        {
          text: "Dólar Australiano",
          value: "AUD-BRL"
        },
        {
          text: "Euro",
          value: "EUR-BRL"
        },
        {
          text: "Libra Esterlina",
          value: "GBP-BRL"
        },
        {
          text: "Peso Argentino",
          value: "ARS-BRL"
        },
        {
          text: "Iene Japonês",
          value: "JPY-BRL"
        },
        {
          text: "Franco Suíço",
          value: "CHF-BRL"
        },
        {
          text: "Yuan Chinês",
          value: "CNY-BRL"
        },
        // {
        //   text: "Novo Shekel Israelense",
        //   value: "YLS-BRL"
        // },
        {
          text: "Bitcoin",
          value: "BTC-BRL"
        },
        {
          text: "Litecoin",
          value: "LTC-BRL"
        },
        {
          text: "Ethereum",
          value: "ETH-BRL"
        },
        {
          text: "Ripple",
          value: "XRP-BRL"
        },
      ]
    }
  },
  computed: {
    currencyPricesAvg() {
      return this.currencyPrices.map(price => (parseFloat(price.high) + parseFloat(price.low)) / 2).reverse()
    },
    // updateTime() {
    //   const difference = differenceInMinutes(new Date(), new Date(this.currencyPrices[0].create_date.replace(' ', 'T')))
    //   if (difference <= 0) return 'agora'
    //   else return `há ${difference} minutos atrás`
    // },
    today() {
      return this.dataFormataExtenso(new Date())
    }
  },
  methods: {
    getCurrency() {
      const url = `${this.baseApiUrl}/${this.currency}/${this.time}`
      axios.get(url)
        .then(res => {
          console.log(res.data)

         res.data.forEach((data, i) => {
            data.create_date = i != 0 ? this.format(this.subDays(new Date(), i), 'yyyy-MM-dd') : data.create_date
            data.code = i != 0 ? this.currency.substring(0, 3) : data.code
          })
          
          this.currencyPrices = [...res.data]
        })
        .catch(() => this.currencyPrices = [])
    },
    // dataFormata(date) {
    //   const day = (day) => {
    //     if (day == 0) return 'Domingo'
    //     else if (day == 1) return 'Segunda-feira'
    //     else if (day == 2) return 'Terça-feira'
    //     else if (day == 3) return 'Quarta-feira'
    //     else if (day == 4) return 'Quinta-feira'
    //     else if (day == 5) return 'Sexta-feira'
    //     else return 'Sábado'
    //   }

    //   const month = (month) => {
    //     if (month == 0) return 'janeiro'
    //     else if (month == 1) return 'fevereiro'
    //     else if (month == 2) return 'março'
    //     else if (month == 3) return 'abril'
    //     else if (month == 4) return 'maio'
    //     else if (month == 5) return 'junho'
    //     else if (month == 6) return 'julho'
    //     else if (month == 7) return 'agosto'
    //     else if (month == 8) return 'setembro'
    //     else if (month == 9) return 'outubro'
    //     else if (month == 10) return 'novembro'
    //     else return 'dezembro'
    //   }

    //   return `${day(date.getDay())}, ${date.getDate()} de ${month(date.getMonth())} de ${date.getFullYear()}`
    // },
  },
  mounted() {
    this.getCurrency()
  }
}
</script>

<style>
  html { overflow-y: auto }
</style>
