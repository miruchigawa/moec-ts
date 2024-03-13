/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
      {
          uid: "6281395685501@s.whatsapp.net",
          name: "moe",
          exp: 0,
          level: 100,
          yen: 1000
      }
  ]);
};
