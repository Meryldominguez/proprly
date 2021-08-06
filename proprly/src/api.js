import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL ||"http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ProprlyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ProprlyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message.map((m, inx)=> message[inx]= {msg:m}) : [{msg:message}];
    }
  }

  // Lots API routes

  /** create a new Lot. */

  static async newLot(data) {
    let res = await this.request(`lots/`,{data},"post");
    return res.lot;
  }
  /** Get details on a lot by id. */

  static async getLot(id) {
    let res = await this.request(`lots/${id}`);
    return res.lot;
  }

  /** Get all lots. Searching can be accomplished by query string*/
  static async getLots(queryString="") {
    let res = await this.request(`lots${queryString}`);
    return res.lots;
  }

  /** Get all lots. Searching can be accomplished by query string*/
  static async updateLot(id, data) {
    let res = await this.request(`lots/`,{data},"patch");
    return res.lot;
  }
  /** Get details on a lot by id. */
  static async deleteLot(id) {
    let res = await this.request(`lots/${id}`,"delete");
    return res;
  }

  // Locations API routes

  /** create a new Lot. */

  static async newLoc(data) {
    let res = await this.request(`lots/`,{data},"post");
    return res.lot;
  }
  /** Get details on a location by id. */

  static async getLoc(id) {
    let res = await this.request(`lots/${id}`);
    return res.lot;
  }

  /** Get all location. Searching by id can be accomplished by query string*/
  static async getLocs(queryString="") {
    let res = await this.request(`lots${queryString}`);
    return res.lots;
  }

  /** Get all location. Searching can be accomplished by query string*/
  static async updateLoc(id, data) {
    let res = await this.request(`lots/`,{data},"patch");
    return res.lot;
  }
  /** delete a location by id. */
  static async deleteLoc(id) {
    let res = await this.request(`lots/${id}`,"delete");
    return res;
  }


// User API routes
  /** User Login */
  static async Login(formData) {
    let res = await this.request(`auth/token`,formData,"post");
    return res;
  }

  /** User register */
  static async Signup(formData) {
    let res = await this.request(`auth/register`,formData,"post");
    return res;
  }
  /** User profile load */
  static async getProfile(username) {
    ProprlyApi.token = window.localStorage.token
    let res = await this.request(`users/${username}`);
    return res;
  }
  /** User profile edit */
  static async patchProfile(username,{password,...data}) {
    ProprlyApi.token = window.localStorage.token
    let res = await this.request(`users/${username}`,data, "patch");
    return res;
  }

}


// for now, put token ("testuser" / "password" on class)
// ProprlyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";
export default ProprlyApi