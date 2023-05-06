import { V2_MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react"
export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export async function loader() {
  const response = await fetch("http://localhost:1337/api/videos");
  const data = await response.json();
  return json({...data});
} 

interface PostResponse {
  id: string;
  attributes: {
    title: string
    description: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  };
} 

export default function VideosRoute() {
  const {data, meta } = useLoaderData();
  return (
    <div>
      {data.map((post: PostResponse) => {
        return (
          <div key={post.id}>
            <h1>{post.attributes.title}</h1>
            <p>{post.attributes.description}</p>
            <Link to={`/videos/${post.id}`}>Watch Video</Link>
          </div>
        );
      })  }
    </div>
  );
}
