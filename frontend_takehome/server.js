const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

const typeDefs = gql`
  type Denial { id: ID! department: String! amount: Float! reason: String! date: String! payer: String! }
  type Query { denials(department: String, payer: String, reason: String): [Denial!]! }
`;
const denialsData = JSON.parse(fs.readFileSync('./data/denials.json'));
const resolvers = {
  Query: {
    denials: (_parent, { department, payer, reason }) =>
      denialsData.filter(
        (d) =>
          (!department || d.department === department) &&
          (!payer || d.payer === payer) &&
          (!reason || d.reason === reason)
      ),
  },
};
new ApolloServer({ typeDefs, resolvers }).listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
