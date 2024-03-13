/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", (tb) => {
      tb.increments("id").primary().notNullable()
      tb.string("uid").notNullable().unique()
      tb.string("name").notNullable()
      tb.integer("exp").notNullable().defaultTo(0)
      tb.integer("level").notNullable().defaultTo(1)
      tb.integer("yen").notNullable().defaultTo(0)
      tb.integer("tf_level").notNullable().defaultTo(100)
      tb.integer("chat_count").notNullable().defaultTo(0)
      tb.integer("gacha_count").notNullable().defaultTo(0)
      tb.boolean("daily_claimed").notNullable().defaultTo(false)
      tb.integer("daily_timestamp").notNullable().defaultTo(0)
      tb.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users")
};
