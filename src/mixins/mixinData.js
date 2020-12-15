/// IMPORT
import { addDays, format, parseISO, differenceInMinutes, getDay, getMonth, getYear, subDays } from "date-fns";

export default {
  /// NAME
  name: "mixinData",

  /// DATA
  data() {
    return {
      diasSemana: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
      ],
      mesesAno: [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ]
    }
  },

  /// METHODS
  methods: {
    addDays,

    parseISO,

    getDay,

    format,

    subDays,

    horaFormata(hora, tamanho) {
      return hora ? hora.substring(0, tamanho) : ""
    },

    dataFormataExtenso(data) {
      let dataExtenso = ""
      dataExtenso = `${this.diasSemana[getDay(data)]}, ${format(data, "dd",)} de ${this.mesesAno[getMonth(data)]} de ${getYear(data)}`
      return dataExtenso
    },

    dataFormataRelativa(data, dataReferencia) {
      let dataRelativa = ""
      if (data) {
        const dataRef = dataReferencia || new Date()
        let tempo = differenceInMinutes(dataRef, data)
        let tempoTemp

        if (tempo < 0) {
          // data futura
          dataRelativa = format(data, "dd/MM/yyyy HH:mm")
        } else {
          if (tempo < 3) {
            // agora
            dataRelativa = "agora"
          } else {
            if (tempo < 60) {
              // minutos
              dataRelativa = `há ${tempo} minutos`
            } else {
              tempo = Math.floor(tempo / 60)

              if (tempo < 24) {
                // horas
                dataRelativa = `há ${tempo} ${tempo > 1 ? 'horas' : 'hora'}`
              } else {
                tempo = Math.floor(tempo / 24)

                if (tempo < 2) {
                  // ontem (Ugo pediu para retornar numero de dias)
                  // dias
                  dataRelativa = `há ${tempo} dia`
                } else {
                  if (tempo < 7) {
                    // esta semana (Ugo pediu para retornar numero de dias)
                    dataRelativa = `há ${tempo} dias`
                  } else {
                    tempoTemp = tempo
                    tempo = Math.floor(tempo / 7)

                    if (tempo < 5) {
                      // semanas
                      dataRelativa = `há ${tempo} ${tempo > 1 ? 'semanas' : 'semana'}`
                    }
                    else {
                      tempo = tempoTemp
                      tempo = Math.floor(tempo / 30)

                      if (tempo < 12) {
                        // meses
                        dataRelativa = `há ${tempo} ${tempo > 1 ? 'meses' : 'mês'}`
                      }
                      else {
                        // anos
                        tempo = Math.floor(tempo / 12)
                        dataRelativa = `há ${tempo} ${tempo > 1 ? 'anos' : 'ano'}`
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return dataRelativa
      }
    },

    differenceInHoursMinutes(dateLeft, dateRight) {
      const totalMinutes = differenceInMinutes(dateLeft, dateRight)
      console.log('totalMinutes', totalMinutes)

      let hours = Math.floor(totalMinutes / 60)
      hours = hours < 10 ? `0${hours}` : `${hours}`
      let minutes = totalMinutes - (parseInt(hours) * 60)
      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`

      return `${hours}:${minutes}`
    }
  }
}