
const TIKTOK_LOGIN_URL = 'https://www.tiktok.com/v2/auth/authorize?client_key=aw68k9974y4f5ymk&response_type=code&redirect_uri=https://clip.elpato.dev&scope=user.info.profile,user.info.basic';

export const LoginPage = () => {

  return (
    <div>
      <h1>Login</h1>
      <a href={TIKTOK_LOGIN_URL}>TikTok Login</a>
    </div>
  );
};