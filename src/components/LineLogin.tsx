export default function LineLogin() {
  const handleLogin = () => {

    const LINE_API_LOGIN = process.env.NEXT_PUBLIC_LINE_API_LOGIN!;
    const LINE_API_CALLBACKURL = process.env.NEXT_PUBLIC_LINE_API_CALLBACKURL!;
    const LINE_CLIENT_ID = process.env.NEXT_PUBLIC_LINE_CLIENT_ID!;

    const url = `${LINE_API_LOGIN}?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${LINE_API_CALLBACKURL}&state=12345&scope=profile openid`;

    window.location.href = url;
  };
  return (
    <div className="grid grid-cols-12 mt-1 mb-4">
      <button
        id="loginBtn"
        className="col-span-12 sm:col-span-6 lg:col-span-4 flex items-center  rounded-lg bg-[#06c755] w-full cursor-pointer"
        onClick={handleLogin}
      >
        <img
          src={`/icon/line_btn.png`}
          alt="line login"
          className="border-r px-4 lg:px-2 border-[#000]/10"
        />
        <span className="text-white w-full text-center">Log in with LINE</span>
      </button>
    </div>
  );
}
