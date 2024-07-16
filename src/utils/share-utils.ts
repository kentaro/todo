import satori from "satori";
import { Todo } from "@/types";
import { ShareTodoImage } from "@/components/share-todo-image";

export async function generateShareImage(todo: Todo): Promise<Blob> {
  try {
    const svg = await satori(ShareTodoImage({ todo }), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: await fetch("/fonts/NotoSansJP-Black.otf").then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Color Emoji",
          data: await fetch("/fonts/NotoColorEmoji-Regular.ttf").then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
      ],
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2D コンテキストの取得に失敗しました。");
    }

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    });

    ctx.drawImage(img, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Blobの生成に失敗しました。"));
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Error generating share image:", error);
    throw error;
  }
}

export async function shareTodo(todo: Todo) {
  try {
    const imageBlob = await generateShareImage(todo);
    const imageFile = new File([imageBlob], "completed-todo.png", {
      type: "image/png",
    });

    const shareText = `「${todo.title}」を完了しました！\nhttps://super-todo.site`;

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      await navigator.share({
        title: "タスク完了！",
        text: shareText,
        files: [imageFile],
        url: "https://super-todo.site",
      });
    } else if (navigator.share) {
      await navigator.share({
        title: "タスク完了！",
        text: shareText,
        url: "https://super-todo.site",
      });
    } else {
      console.log("Web Share API is not supported in this browser.");
      alert("申し訳ありませんが、このブラウザは共有機能をサポートしていません。");
    }
  } catch (error) {
    console.error("Error sharing todo:", error);
    if (error instanceof Error) {
      alert(`共有中にエラーが発生しました: ${error.message}`);
    } else {
      alert("共有中に不明なエラーが発生しました。");
    }
  }
}
