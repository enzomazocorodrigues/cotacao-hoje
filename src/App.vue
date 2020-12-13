<template>
  <v-app>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container class="fill-height">
        <v-card class="mx-auto mb-0 pb-0" width="700px">
          <v-card-title>
            <v-row no-gutters justify="space-between" align="baseline">
              <v-col cols="6">
                <span class="title" >{{ today }}</span>
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
              <span class="text-h3">{{ currencyNowPrice }}</span>
            </div>
            <span class="text-caption">{{ updateTime }}</span>
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
              <span>máxima</span>
              <span>variação</span>
            </v-row>
            <v-row no-gutters justify="space-between">
              <span class="font-weight-medium">R$ {{ currencyPrices[0].low }}</span>
              <span class="font-weight-medium">R$ {{ currencyPrices[0].high }}</span>
              <span class="font-weight-medium">{{ currencyPrices[0].pctChange }}%</span>
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
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import { differenceInMinutes } from 'date-fns'
const longDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' })
export default {
  name: 'App',
  data() {
    return {
      longDate,
      baseApiUrl: 'https://economia.awesomeapi.com.br/json/daily',
      time: 8,
      currencyPrices: [],
      currency: "USD-BRL",
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
        {
          text: "Novo Shekel Israelense",
          value: "YLS-BRL"
        },
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
    currencyNowPrice() {
      return (parseFloat(this.currencyPrices[0].high) + parseFloat(this.currencyPrices[0].low)) / 2
    },
    currencyPricesAvg() {
      return this.currencyPrices.map(price => (parseFloat(price.high) + parseFloat(price.low)) / 2).reverse()
    },
    updateTime() {
      const difference = differenceInMinutes(new Date(), new Date(this.currencyPrices[0].create_date.replace(' ', 'T')))
      if (difference <= 0) return 'agora'
      else return `há ${difference} minutos atrás`
    },
    today() {
      return this.dataFormata(new Date())
    }
  },
  methods: {
    getCurrency() {
      const url = `${this.baseApiUrl}/${this.currency}/${this.time}`
      axios.get(url)
        .then(res => {
          this.currencyPrices = [...res.data]
        })
        .catch(() => this.currencyPrices = [])
    },
    dataFormata(date) {
      const day = (day) => {
        if (day == 0) return 'Domingo'
        else if (day == 1) return 'Segunda-feira'
        else if (day == 2) return 'Terça-feira'
        else if (day == 3) return 'Quarta-feira'
        else if (day == 4) return 'Quinta-feira'
        else if (day == 5) return 'Sexta-feira'
        else return 'Sábado'
      }

      const month = (month) => {
        if (month == 0) return 'janeiro'
        else if (month == 1) return 'fevereiro'
        else if (month == 2) return 'março'
        else if (month == 3) return 'abril'
        else if (month == 4) return 'maio'
        else if (month == 5) return 'junho'
        else if (month == 6) return 'julho'
        else if (month == 7) return 'agosto'
        else if (month == 8) return 'setembro'
        else if (month == 9) return 'outubro'
        else if (month == 10) return 'novembro'
        else return 'dezembro'
      }

      return `${day(date.getDay())}, ${date.getDate()} de ${month(date.getMonth())} de ${date.getFullYear()}`
    },
  },
  mounted() {
    this.getCurrency()
  }
}
</script>

<style>
</style>
