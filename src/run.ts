import {Model} from "./model";
import {createPool} from "./pool";
import {FieldsObject} from "./schema";
import {Table} from "./table";

class Team extends Model {
  fields(t: FieldsObject) {
    t.id();
    t.string("name", true);
    t.timestamp("created_at");
  }
}

class User extends Model {
  fields(t: FieldsObject) {
    t.id();
    t.int("team_id");
    t.string("email", true);
    t.string("password");
    t.timestamp("created_at");
    t.foreign("member").references("team_id").in(Team, "id");
  }
}

async function main() {
  await createPool({
    user: "koci",
    password: "local",
    database: "test0",
  });

  console.log(await Table.create(Team, true));
  console.log(await Table.create(User, true));

  /* const user = new User();
  user.email = "test@test.com";
  user.password = "test";
  user.save(); */
}

main();
