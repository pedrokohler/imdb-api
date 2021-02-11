import request from "supertest";
import app from "../../app";
import {
  createValidAdminToken,
  createValidRegularUserToken,
} from "./token.factory";

class RequestBuilder {
  constructor() {
    this.newRequest();
  }

  newRequest() {
    this.request = request(app);
    return this;
  }

  build() {
    return this.request;
  }

  post(path) {
    this.request = this.request.post(path);
    return this;
  }

  get(path) {
    this.request = this.request.get(path);
    return this;
  }

  delete(path) {
    this.request = this.request.delete(path);
    return this;
  }

  patch(path) {
    this.request = this.request.patch(path);
    return this;
  }

  send(path) {
    this.request = this.request.send(path);
    return this;
  }

  withValidRegularUserToken(userId) {
    this.request = this.request.set(
      "Authorization",
      createValidRegularUserToken(userId)
    );
    return this;
  }

  withValidAdminToken(userId) {
    this.request = this.request.set(
      "Authorization",
      createValidAdminToken(userId)
    );
    return this;
  }
}

export default RequestBuilder;
