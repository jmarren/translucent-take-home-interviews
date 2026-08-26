const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

const typeDefs = gql`
  type Denial { id: ID! department: String! amount: Float! reason: String! date: String! payer: String! }
  type Query { denials(department: String, payer: String): [Denial!]! }
`;
const denialsData = JSON.parse(fs.readFileSync('./data/denials.json'));
const resolvers = {
  Query: {
    denials: (_parent, { department, payer }) =>
      denialsData.filter(
        (d) => (!department || d.department === department) && (!payer || d.payer === payer)
      ),
  },
};
new ApolloServer({ typeDefs, resolvers }).listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
