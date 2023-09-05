import React from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
} from "react-share";

const InviteWidget = ({ myId }) => {
  const content = `
    Let's hop on a video chat.
    1. Copy this code - ${myId}
    2. Click the link - https://fabulous-sundae-c611c5.netlify.app/.
    3. Paste the code and call away.
    `;
  return (
    <div className="flex justify-around items-center w-full p-2 animate-slideDown">
      <WhatsappShareButton url={content} quote={content}>
        <WhatsappIcon size={30} round={true} />
      </WhatsappShareButton>

      <FacebookShareButton url={content} quote={content}>
        <FacebookIcon size={30} round={true} />
      </FacebookShareButton>

      <TelegramShareButton url={content} quote={content}>
        <TelegramIcon size={30} round={true} />
      </TelegramShareButton>
    </div>
  );
};

export default InviteWidget;
