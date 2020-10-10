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

  class Team extends Model {
    id?: number;
    name?: string;
    created_at?: string;

    fields(t: FieldsBuilder) {
      t.id();
      t.string("name", true /* UNIQUE */);
      t.timestamptz("created_at");
    }
  }

  class User extends Model {
    id?: number;
    team_id?: number;
    email?: string;
    password?: string;
    created_at?: string;

    fields(t: FieldsBuilder) {
      t.id();
      t.int("team_id");
      t.string("email", true);
      t.string("password");
      t.timestamptz("created_at");
      t.foreign("member").references("team_id").in(Team, "id");
    }
  }

  await Table.create(Team);
  await Table.create(User);

  const user = new User();
  user.email = "test@test.com";
  user.password = "argon2:...";
  user.team_id = 1;
  await user.save();

  const userWithEmailAndId = await User.find(
    // WHERE (Conditions)
    {id: 1, email: "test@test.com"},

    // SELECT (email, team_id, created_at) (Fields)
    "email",
    "team_id",
    "created_at",
  );

  const allUsers = await User.find(
    // WHERE ([Conditions: null] = *)
    null,
    // SELECT * ([Fields: null] = *)
  );
}

main();
```
