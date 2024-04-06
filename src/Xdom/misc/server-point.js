import Axios from 'axios';

const hostpath = 'https://api.xdom-crm.com'
const localpath = 'http://localhost:8888'

export default Axios.create({baseURL: localpath});
