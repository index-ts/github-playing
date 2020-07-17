console.log('Bootstrapping.');

interface Music {
  name: string;
  artists: string;
  album?: string;
  year?: string;
  url?: string;
  albumCoverImage: string;
  updatedAt: Date;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('refresh', { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener(a => {
    if (a.name !== 'refresh') {
      return;
    }
    specify();
  })
  specify();
});

const specify = () => {
  chrome.tabs.query({audible: true}, tabs => {
    for (const tab of tabs) {
      if (tab.audible && tab.url.startsWith('https://music.youtube.com/')) {
        chrome.tabs.executeScript(tab.id, {
          code: "[document.querySelector('yt-formatted-string.ytmusic-player-bar.title').innerText, document.querySelector('yt-formatted-string.ytmusic-player-bar.byline').title, document.querySelector('img.ytmusic-player-bar').src, document.querySelector('.ytmusic-player-bar .yt-simple-endpoint').href]"
        }, results => {
          const res = results[0] as string[];
          const name = res[0];
          const infos = res[1].split(" • ");
          const [artists, album, year] = infos;
          const albumCoverImgSrc = res[2];
          const albumCoverImgOriginal = new RegExp('(.*)=.*').exec(albumCoverImgSrc)[1];
          const url = res[3];

          console.log('name', name);

          updateProfile({
            name,
            artists,
            album,
            year,
            url,
            albumCoverImage: albumCoverImgOriginal,
            updatedAt: new Date(),
          });
        });
      }
      console.log(tab);
    }
  });
}

const updateProfile = (music: Music) => {
  const id = "webhacking";
  const oauth = "384afe87dd727c82504b1837c23ac06e4501ab08";
  const message = `now i'my playing ${music.name}`;
  const auth = `token ${oauth}`;
  fetch(`https://api.github.com/repos/${id}/${id}/contents/README.template.md`, {
    headers: {
      "Authorization": auth
    },
  }).then(async resp => {
    const json = await resp.json();
    const template = decodeURIComponent(escape(atob(json.content)));
    const content = template
      .replace("{CURRENT_PLAYING_NAME}", music.name)
      .replace("{CURRENT_PLAYING_ARTISTS}", music.artists)
      .replace("{CURRENT_PLAYING_ALBUM}", music.album)
      .replace("{CURRENT_PLAYING_RELEASED}", music.year)
      .replace("{CURRENT_PLAYING_ALBUM_SRC}", music.albumCoverImage)
      .replace("{CURRENT_PLAYING_URL}", music.url)
      .replace("{CURRENT_PLAYING_LAST_UPDATED}", music.updatedAt.toLocaleString());
    const encoded = btoa(unescape(encodeURIComponent(content)));
    const target = await fetch(`https://api.github.com/repos/${id}/${id}/contents/README.md`);
    const sha = (await target.json()).sha;
    try {
      await fetch(`https://api.github.com/repos/${id}/${id}/contents/README.md`, {
        method: "PUT",
        headers: {
          "Authorization": auth
        },
        body: JSON.stringify({
          "message": message,
          "content": encoded,
          "sha": sha,
          "committer": {
            "name": id,
            "email": `${id}@github.com`,
          },
        }),
      });
    } catch (postResp) {
      console.log(`Error ${postResp}`);
    }
  })
};


