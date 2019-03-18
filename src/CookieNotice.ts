
export class CookieNotice {

  constructor(
    onAllowCookies: () => void
  ) {
    const divID = "CookieNotice"
    const buttonClass = "Button"
    const acceptID = "accept"
    const declineID = "decline"
    const textID = "text"

    const style = document.createElement("style")
    style.innerHTML = `
    #${divID} {
      font-family: sans-serif;
      position: absolute;
      bottom: 20px;
      width: 100%;
      max-width: 800px;
      background-color: #ffffff;
      box-shadow: 0 1px 2px 1px black;
      text-align: center;
      padding: 10px;
      box-sizing: border-box;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 5px;
    }

    #${textID} {
      font-size: 1.3rem;
      line-height: 2rem;
    }

    #${divID} .${buttonClass} {
      box-shadow: 0 1px 2px -1px black; 
      font-size: 2rem;
      color: white;
      text-shadow: 0 2px 2px black;
      border-style: none;
      border-radius: 5px;
      flex: 1;
      margin-left: 1rem;
    }

    #${divID} ${buttonClass}:first-child {
      margin-right: 1rem;
      margin-left: 0;
    }

    #${divID} ${buttonClass}:hover {
      cursor: pointer;
    }

    #${acceptID} {
      background-color: #6abe30;
    }
    
    #${declineID} {
      background-color: #ac3232;
    }

    .row {
      padding-top: 20px;
      display: flex;
    }

    `
    document.body.appendChild(style)


    const element = document.createRange().createContextualFragment(`
    <div id="${divID}">
      <div class="padding">
        <h1>Allow cookies?</h1>
        <div id="${textID}">
          Accepting cookies will store <i>allowedStorage</i> and <i>highscore</i>
          in your browser. <i>allowedStorage</i> will prevent this message from
          reappearing and <i>highscore</i> will store your highscore.
        </div>
        <div class="row">
          <button id="${acceptID}" class="${buttonClass}">Yes</button>
          <button id="${declineID}" class="${buttonClass}">No</button>
        </div>
      </div>
    </div>
    `)
    document.body.appendChild(element)

    const div = document.getElementById(divID)
    const acceptButton = document.getElementById(acceptID)
    const declineButton = document.getElementById(declineID)

    if (div && acceptButton && declineButton) {
      acceptButton.addEventListener("click", () => {
        document.body.removeChild(div)
        onAllowCookies()
      })

      declineButton.addEventListener("click", () => {
        document.body.removeChild(div)
        document.body.removeChild(style)
      })
    }
  }
}