import DbServiceAdapter from "./utils/db.service.adapter";
import User from "../models/user.model";

const UserService = new DbServiceAdapter(User);

export default UserService;
