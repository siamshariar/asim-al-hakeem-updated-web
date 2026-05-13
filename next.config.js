module.exports = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/qna": ["./data/qna.json", "./data/qnCat.json"],
      "/qna/[[...slug]]": ["./data/qna.json", "./data/qnCat.json"],
      "/qna/answer/[id]": ["./data/qna.json", "./data/qnCat.json"],
    },
  },
  async redirects() {
    return [
      {
        source: "/lectures",
        destination: "/lectures/UUWsdcrre0WbCWML_PnuzoAg",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blog-dev1dit.vercel.app",
      },
      {
        protocol: "https",
        hostname: "muhammadsaifullah.com",
      },
      {
        protocol: "https",
        hostname: "www.muhammadsaifullah.com",
      },
      {
        protocol: "https",
        hostname: "www.assimalhakeem.net",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};
