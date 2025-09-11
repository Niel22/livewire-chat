export const formatMessageDateLong = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if(isToday(inputDate)){
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }else if(isYesterday(inputDate)){
        return (
            "Yesterday " + 
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        );
    }else if(inputDate.getFullYear() === now.getFullYear()){
        return inputDate.toLocaleTimeString([], {
            day: "2-digit",
            month: "short"
        });
    }else{
        return inputDate.toLocaleDateString();
    }
}

export const formatMessageDateShort = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    } else if (isYesterday(inputDate)) {
        return "Yesterday";
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short"
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};


export const isToday = (date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

export const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        date.getDate() === yesterday.getDate &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    );
}

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");

    return mime[0].toLowerCase() === "image";
}

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");

    return mime[0].toLowerCase() === "video";
}

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");

    return mime[0].toLowerCase() === "audio";
}

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type;
    return mime.toLowerCase() === "application/pdf";
}

export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    );
}

export const formatBytes = (bytes, decimals = 2) => {
    if(bytes === 0) return "0 bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"]

    let i = 0;
    let size = bytes;
    while (size >= k){
        size /= k;
        i++;
    }

    return parseFloat(size.toFixed(dm)) + " " + sizes[i];
}

export async function fetchMessageById(message) {
    try {
        const res = await axios.get(`/messages/${message}`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch message", err);
        return null;
    }
}

export const formatScheduledTime = (dateString) => {
  if (!dateString) return "--/--/----";

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",    
    day: "numeric",  
    year: "numeric",  
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} • ${formattedTime}`;
};

export const formatNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};
