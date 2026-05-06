import { getYoutubeVideoListByUrl } from "../lib/fetch";

export default async function fetchLectures(url) {
    return await getYoutubeVideoListByUrl(url);
}
