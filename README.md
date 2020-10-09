# aarti

> Almost an Active Record TypeScript Implementation ¯\\\_(ツ)\_/¯

🚧 Work in progress

## Installation

```bash
npm install aarti

# or
yarn add aarti
```

## Usage

```ts
import {Database, Model, Table} from "aarti";
import {FieldsBuilder} from "aarti/interfaces";

async function main() {
  new Database(PoolConfig); // <= pg.PoolConfig

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

  const user = new User();
  user.email = "test@test.com";
  user.password = "argon2:...";
  user.team_id = 1;
  await user.save();

  const {length, data} = await User.find<User>((where) => {
    where("id").is(1);
    where("email").is("test@test.com");
  }).fields(["email", "team_id", "created_at"]);

  console.log("find id = 1", data);
}

main();
```
