import { Todo } from "@/types";
import Y2KLogo from "./y2k-logo";

type ShareTodoImageProps = {
  todo: Todo;
};

export function ShareTodoImage({ todo }: ShareTodoImageProps) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #ff69b4, #00ffff)",
        fontFamily: "'Noto Sans JP', 'Noto Color Emoji', sans-serif",
        color: "#ffffff",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "16px",
            wordBreak: "break-word",
            color: "#444",
            textAlign: "left",
          }}
        >
          「{todo.title}」を完了しました！
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#666",
            textAlign: "left",
          }}
        >
          完了日時: {new Date().toLocaleString("ja-JP")}
        </p>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: "40px",
        }}
      >
        <Y2KLogo className="text-7xl sm:text-8xl" />
        <img src="/icon-512x512.png" alt="App Icon" style={{ width: '30px', height: '30px', marginLeft: '4px' }} />
      </div>
    </div>
  );
}
