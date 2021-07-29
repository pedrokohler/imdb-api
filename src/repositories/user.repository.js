import DbRepositoryAdapter from "./common/db.repository.adapter";
import User from "../models/user.model";

const UserRepository = new DbRepositoryAdapter(User);

export default UserRepository;
