  
  
  `
        <h3>${artistData.id}
            <span class="small-name">
                (<a href="${artistData.uri}" target="_blank">${artistData.id}</a>)
            </span>
        </h3>
        <div class="dc-content">
            <div class="dc-avatar">
                <a href="${artistData.uri}" target="_blank">
                    <img src="${artistData.thumb}" width="80" height="80" />
                </a>
            </div>
             <p>Members: ${artistData.id} <br> <a href="${artistData.resource_url}">Releases</a></p>
        </div>
        <button onclick="writeToDocument('${artistData.id}')">Releases</button>
        `
        
        
        
        
// curl "https://api.discogs.com/database/search?q=Nirvana&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox"
        // <button onclick="writeToDocument('https://api.discogs.com/artists/${artistData.id}/releases')">Releases</button>  