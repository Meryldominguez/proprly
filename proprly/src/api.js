import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ProprlyApi {
  // the token for interactive with the API will be stored here.
  // static token;

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, '\nData:', data, '\nMethod:', method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = {Authorization: `Bearer ${ProprlyApi.token}`};
    const params = (method === 'get') ?
      data :
      {};

    try {
      return (await axios({
        url, method, data, params, headers,
      })).data;
    } catch (err) {
      console.error('API Error:', err);
      const {message} = err.response.data.error;
      throw Array.isArray(message) ?
        message.map((m, inx) => message[inx] = {msg: m}) :
        [{msg: message}];
    }
  }

  // Lots API routes

  /** create a new Lot. */

  static async newLot(data) {
    const res = await this.request('lots/', {...data}, 'post');
    return res.lot;
  }
  /** Get details on a lot by id. */

  static async getLot(id) {
    const res = await this.request(`lots/${id}`);
    return res.lot;
  }

  /** Get all lots. Searching can be accomplished by query string */
  static async getLots(queryString = '') {
    const res = await this.request(`lots${queryString}`);
    return res.lots;
  }

  /** Get all lots. Searching can be accomplished by query string */
  static async updateLot(id, data) {
    const res = await this.request(`lots/${id}`, {...data}, 'patch');
    return res.lot;
  }

  /** Get details on a lot by id. */
  static async deleteLot(id) {
    const method = 'delete';
    const res = await this.request(`lots/${id}`, {}, method);
    return res;
  }

  // Locations API routes

  /** create a new Loc. */

  static async newLoc(data) {
    const res = await this.request('locations/', {...data}, 'post');
    return res.location;
  }
  /** Get details on a location by id. */

  static async getLoc(id) {
    const res = await this.request(`locations/${id}`);
    return res.location;
  }

  /** Get all locations nested with children. Searching by id can be accomplished by query string */
  static async getLocs(query = '') {
    const res = await this.request(`locations${query}`);
    return res.locations;
  }

  /** Get all locations not nested. */
  static async listLocs() {
    const res = await this.request('locations/list');
    return res.locations;
  }

  /** Get all location. Searching can be accomplished by query string */
  static async updateLoc(id, data) {
    const res = await this.request(`locations/${id}`, {...data}, 'patch');
    return res.location;
  }

  /** delete a location by id. */
  static async deleteLoc(id) {
    const method = 'delete';
    const res = await this.request(`locations/${id}`, {}, method);
    return res;
  }

  // Prods API routes

  /** create a new Lot. */

  static async newProd(data) {
    data.dateStart = data.dateStart ? new Date(data.dateStart).toUTCString() : null;
    data.dateEnd = data.dateEnd ? new Date(data.dateEnd).toUTCString() : null;

    const res = await this.request('productions/', {...data}, 'post');
    return res.production;
  }
  /** Get details on a lot by id. */

  static async getProd(id) {
    const res = await this.request(`productions/${id}`);
    return res.production;
  }

  /** Get all lots. Searching can be accomplished by query string */
  static async searchProds(queryString = '') {
    const res = await this.request(`productions${queryString}`);
    return res.productions;
  }

  /** update a Production by id */
  static async updateProd(id, data) {
    data.dateStart = data.dateStart ? new Date(data.dateStart).toUTCString() : null;
    data.dateEnd = data.dateEnd ? new Date(data.dateEnd).toUTCString() : null;

    const res = await this.request(`productions/${id}`, {...data}, 'patch');
    return res.production;
  }

  /** delete a Production by id. */
  static async deleteProd(id) {
    const method = 'delete';
    const res = await this.request(`productions/${id}`, {}, method);
    return res;
  }
  // Props API routes

  /** create a new prop. */

  static async newProp(data) {
    const res = await this.request('props/', {...data}, 'post');
    return res.prop;
  }

  /** update a prop by id */
  static async updateProp(prodId, lotId, data) {
    const res = await this.request(`props/${prodId}/${lotId}`, {...data}, 'patch');
    return res.production;
  }

  /** delete a Production by id. */
  static async deleteProp(prodId, lotId) {
    const method = 'delete';
    const res = await this.request(`props/${prodId}/${lotId}`, {}, method);
    return res;
  }

  // User API routes
  /** User Login */
  static async Login(formData) {
    const res = await this.request('auth/token', formData, 'post');
    return res;
  }

  /** User register */
  static async Signup(formData) {
    const res = await this.request('auth/register', formData, 'post');
    return res;
  }

  /** User profile load */
  static async getProfile(username) {
    const res = await this.request(`users/${username}`);
    return res;
  }

  /** User profile edit */
  static async patchProfile(username, {password, ...data}) {
    const res = await this.request(`users/${username}`, data, 'patch');
    return res;
  }
}

export default ProprlyApi;
