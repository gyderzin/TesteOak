import axios from 'axios'

const axiosExport = axios.create({
  baseURL: 'https://apithundermonkey.com.br',
})

export default axiosExport
