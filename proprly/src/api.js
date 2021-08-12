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
    console.debug("API Call:", endpoint, "\nData:",data, "\nMethod:", method);

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
    const method="delete"
    let res = await this.request(`lots/${id}`,{},method);
    return res;
  }

  // Locations API routes

  /** create a new Loc. */

  static async newLoc(data) {
    let res = await this.request(`locations/`,{data},"post");
    return res.location;
  }
  /** Get details on a location by id. */

  static async getLoc(id) {
    let res = await this.request(`locations/${id}`);
    return res.location;
  }

  /** Get all locations nested with children. Searching by id can be accomplished by query string*/
  static async getLocs(query="") {
    let res = await this.request(`locations${query}`);
    const recursiveLoc = (arr)=>{
      const child = arr.pop()
      const parsed = arr.every((loc,idx) => {
        if (loc.locationId=== child.parentId) {
          loc.children=loc.children?
            [...loc.children,child]:[child]
          return false
        }
        return true
      })
      if (parsed){
        arr.push(child)
        return arr
      }
      return recursiveLoc(arr)
    }
    const parsedLocations =recursiveLoc(res.locations)
    return parsedLocations
    // return res.locations
  }

  /** Get all location. Searching can be accomplished by query string*/
  static async updateLoc(id, data) {
    let res = await this.request(`locations/${id}`,{data},"patch");
    return res.location;
  }
  /** delete a location by id. */
  static async deleteLoc(id) {
    let method="delete"
    let res = await this.request(`locations/${id}`,{},method);
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
    // Lots API routes

  /** create a new Lot. */

  static async newProd(data) {
    let res = await this.request(`lots/`,{data},"post");
    return res.lot;
  }
  /** Get details on a lot by id. */

  static async getProd(id) {
    let res = await this.request(`lots/${id}`);
    return res.lot;
  }

  /** Get all lots. Searching can be accomplished by query string*/
  static async searchProds(queryString="") {
    let res = await this.request(`lots${queryString}`);
    return res.lots;
  }

  /** Get all lots. Searching can be accomplished by query string*/
  static async updateProd(id, data) {
    let res = await this.request(`lots/`,{data},"patch");
    return res.lot;
  }
  /** Get details on a lot by id. */
  static async deleteProd(id) {
    const method="delete"
    let res = await this.request(`lots/${id}`,{},method);
    return res;
  }

}


// for now, put token ("testuser" / "password" on class)
// ProprlyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";
export default ProprlyApi