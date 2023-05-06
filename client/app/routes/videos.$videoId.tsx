import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
  const response = await fetch(
    "http://localhost:1337/api/videos/" + params.videoId + "?populate=*"
  );
  const data = await response.json();
  return json({ ...data });
}

interface PostResponse {
  data: {
    id: string;
    attributes: {
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      video: {
        data: {
          id: string;
          attributes: {
            name: string;
            url: string;
          };
        };
      };
    };
  };
  meta: any;
}

export default function VideoDynamicRoute() {
  const { data, meta } = useLoaderData() as PostResponse;
  return (
    <div>
      <h1>{data.attributes.title}</h1>
      <p>{data.attributes.description}</p>
      <video
        controls
        src={
          "http://localhost:1337" + data.attributes.video.data.attributes.url
        }
      />
    </div>
  );
}
