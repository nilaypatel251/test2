const { ApolloServer, gql } = require("apollo-server-micro");

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mikqzhlqtdnjhozukixv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTcxOTQ5NCwiZXhwIjoxOTM1Mjk1NDk0fQ.fJkooD7FAMPVtULmCTCAQl4ASKwwBWxVQmjVN0Uhg0A";
const supabase = createClient(supabaseUrl, supabaseKey);

const typeDefs = gql`
  
  type Topics{
    id:ID
    tname:String
    timage:String
  }

  type Posts{
    id:ID
    title:String
    content:String
    image:String
    topic_id:ID
    comment(pid:ID!):[Comment!]!
  }

  type SubPost{
    id:ID
    content:String
    post_id:ID
  }

  type Comment {
    id: ID
    content: String
    pid:ID
  }

  type SubComment{
    id:ID
    content:String
    cid:ID
  }

  type Query {
    topics:[Topics]
    singletopic(id:ID!):[Topics]

    posts(tid:ID):[Posts]
    singlePost(id:ID!):[Posts]
    subPost(post_id:ID!):[SubPost]

    comment(pid:ID!):[Comment]
    subComment(cid:ID!):[SubComment]
  }

  type Mutation {
    
    addComment(id:ID,content:String,pid:ID):Comment
    addSubComment(id:ID,content:String,cid:ID!):SubComment
    addSubPost(id:ID,content:String,post_id:ID!):SubPost
  }

`;



const resolvers = {
  Query: {
    

    topics:async()=>{
      const query = await supabase.from("Topics").select("*");
      return query.body;
    },

    singletopic:async(_, { id })=>{

      const queryx = await supabase
        .from("Topics")
        .select("*")
        .eq("id", id);
        
        
      return queryx.body;
    },

    posts:async(_,{tid})=>{

      const queryx = await supabase
        .from("Posts")
        .select("*")
        .eq("topic_id", tid);
        
        
      return queryx.body;
      
    },

    singlePost:async(_, { id })=>{

      const queryx = await supabase
        .from("Posts")
        .select("*")
        .eq("id", id);
        
        
      return queryx.body;
      
        
    },

    subPost:async(_,{post_id})=>{

      const subpost=await supabase
      .from("SubPost")
      .select("*")
      .eq("post_id",post_id);

      return subpost.body;

    },

    comment:async(_,{pid})=>{

      const comment= await supabase
      .from("Comment")
      .select("*")
      .eq("pid",pid);
      //console.log(comment.body);
      return comment.body;

    },

    subComment:async(_,{cid})=>{

      const subcomments=await supabase
      .from("SubComment")
      .select("*")
      .eq("cid",cid);
      //console.log(comment.body);
      return subcomments.body;
    },

  },

  Posts:{

      
    comment:async(_,{pid})=>{

      const comment= await supabase
      .from("Comment")
      .select("*")
      .eq("pid",pid);
      
      return comment.body;

    },


},

  Mutation: {
    
    
    addComment:async(_,{content,pid})=>{
      const comment={
        content,
        pid,
      };

      const { data, error } = await supabase
      .from("Comment")
      .insert([{content: content, pid: pid }]);

        console.log(data);
        console.log(error);

        // pubsub.publish('COMMENT_ADDED', {commentAdded:{
          
        //   id:id,
        //   content:content,
        //   pid:pid
          
        // }});
        return comment;
    },

    addSubComment:async(_,{content,cid})=>{
      const subcomment={
        content,
        cid,
      };

      const { data, error } = await supabase
      .from("SubComment")
      .insert([{content: content,cid:cid}]);

        console.log(data);
        console.log(error);

        
        return subcomment;
    },

    addSubPost:async(_,{content,post_id})=>{
      const subpost={
        content,
        post_id,
      };

      const { data, error } = await supabase
      .from("SubPost")
      .insert([{content: content,post_id:post_id}]);

      
              
        return subpost;
    },

  },

  // Subscription: {

  //   commentAdded:{
  //     subscribe:()=>pubsub.asyncIterator(['COMMENT_ADDED']),
  //   }
    
  // }

  
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
//   subscriptions: {
//     path: "/subscriptions",
//     onConnect: (connectionParams, webSocket, context) => {
//       console.log("Client connected");
//     },
//     onDisconnect: (webSocket, context) => {
//       console.log("Client disconnected");
//     }
//   },

//   context:({event,context})=>({
//       headers: event.headers,
//       functionName:context.functionName,
//       event,
//       context
//   })
});


exports.handler=server.createHandler({
    path:'/api/graphql',
    // cors:{
    //     origin:'*',
    //     credentials:true,
    // }
})

export const config={
          api:{
              bodyParser:false,
          }
}