import Image from 'next/image';
import { date } from '../../lib/format';
import { useState, useEffect } from "react";
import { generateVParam } from '../../pages/lectures/[pid]';

export default function PostCardRecent({ item, statistics, videoId, playlistId, onClick }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const id = item.id;
    const image = item.image;
    const title = item.title;
    const publishedAt = date(item.date);
    const viewCount = statistics ? statistics[id] : '';
    const [urlParams, setUrlParams] = useState(null);
    const [pathname, setPathname] = useState("");

    const getVideoUrl = (slug) => {
    if (urlParams) {
      urlParams.set("v", slug);
      return `${pathname}`;
    }
    return pathname;
    };

    useEffect(() => {
      if (typeof window !== "undefined") {
        const generatedPathname = `/lectures/?v=${generateVParam(id, title)}`;
        const params = new URLSearchParams(window.location.search);
        params.set("v", generateVParam(id, videoId, title));
    
        setPathname(generatedPathname);
        setUrlParams(params);
      }
      }, [id, title, videoId]);
  

    const handleVideoClick = () => {
        setIsModalOpen(true);
        if (onClick) {
            onClick({ id, title, videoId, playlistId, viewCount, publishedAt });
        }
    };


    const handleClick = (event) => {
        event.preventDefault();
        handleVideoClick();
    };

    return (
        <div className="card card-r pc-video" onClick={handleClick}> 
            <div className="card-image">
                <a  className="image-r"
                  href={getVideoUrl(item.slug, pathname, urlParams)}
                  onClick={(e) => {
                      if (!isModalOpen) {
                          e.preventDefault();
                          handleVideoClick();
                      }
                  }}
                >
                <Image
                    src={image ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : `/img/post/youtube-default.jpg`}
                    alt={title || 'YouTube Video'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center center',
                    }}
                    loading="eager"
                    unoptimized
                />


                </a>
            </div>

            <div className="card-content">
                <a
                    href={getVideoUrl(item.slug, pathname, urlParams)}
                    onClick={(e) => {
                        if (!isModalOpen) {
                            e.preventDefault();
                            handleVideoClick();
                        }
                    }}
                    className="heading-r"
                >
                    {title}
                </a>
                <div className="data-line">
                    <span className="view-r">{viewCount} views</span>
                    <span className="date-r">{publishedAt}</span>
                </div>
            </div>
        </div>
    );
}
