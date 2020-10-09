import {Database} from "./database";
import {Model} from "./model";
import {FieldsBuilder} from "./schema";
import {Table} from "./table";

interface Team {
  id: number;
  name: string;
  created_at: string;
}

class Team extends Model {
  fields(t: FieldsBuilder) {
    t.id();
    t.string("name", true);
    t.timestamptz("created_at");
  }
}

interface User {
  id: number;
  team_id: number;
  email: string;
  password: string;
  created_at: string;
}

class User extends Model {
  fields(t: FieldsBuilder) {
    t.id();
    t.int("team_id");
    t.string("email", true);
    t.string("password");
    t.timestamptz("created_at");
    t.foreign("member").references("team_id").in(Team, "id");
  }
}

async function main() {
  new Database({
    user: "koci",
    password: "local",
    database: "test0",
  });

  await Table.create(Team);
  await Table.create(User);

  // const {rows} = await User.find<User>((where) => {
  //   where("id");
  // }).fields(["email", "team_id", "created_at"]);
  // console.log("find id = 1", rows);

  // const {rows} = await User.find<User>((where) => {
  //   where("id").isLessThan(2);
  //   where("email").is("test@test.com");
  // }).fields("*");

  const {data: first3} = await User.first<User>(3, ["id", "email", "team_id"]);
  console.log(first3);

  const {data: last3} = await User.last<User>(3, ["id", "email", "team_id"]);
  console.log(last3);

  // const team = new Team();
  // team.name = "Test Team";
  // await team.save();

  // for (let i = 0; i < 10; i++) {
  //   const user = new User();
  //   user.email = `test${i}@test.com`;
  //   user.password = "test";
  //   user.team_id = 1;
  //   await user.save();
  // }

  // const {rows: users} = await User.all<User>([
  //   "id",
  //   "team_id",
  //   "email",
  //   "created_at",
  // ]);
  // console.log("all users", users);
}

main();
