class AppConfig {
    public readonly chatGptUrl = "https://api.openai.com/v1/chat/completions";
    public readonly chatGptApiKey = import.meta.env.VITE_CHATGPT_API_KEY as string;
}
 
export const appConfig = new AppConfig();