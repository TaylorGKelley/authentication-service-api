import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const LoginCallback = () => {
  const [myInfo, setMyInfo] = useState<{
    id: number;
    email: string;
  }>();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("at"); // at = access token

  useEffect(() => {
    const fetchMyInfo = async () => {
      fetch("http://localhost:7001/api/v1/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((result) => setMyInfo(result.user))
        .catch((error) => console.error(error));
    };

    fetchMyInfo();
  }, [accessToken]);

  return (
    <main>
      {!myInfo ? (
        <></>
      ) : (
        <>
          <p>id: {myInfo?.id}</p>
          <p>email: {myInfo?.email}</p>
        </>
      )}
    </main>
  );
};

export default LoginCallback;
