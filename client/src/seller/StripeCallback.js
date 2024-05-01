import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInLocalStorage } from "../actions/auth";
import { getAccountStatus } from "../actions/stripe";

const StripeCallback = ({ history }) => {
  const { auth } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch()

  useEffect(() => {
    if(auth && auth.token) accountStatus()
  }, [auth])

  const accountStatus = async () => {
    try {
        const res = await getAccountStatus(auth.token)
        // console.log('user stripe status', res)
        updateUserInLocalStorage(res.data, () => {
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: res.data,
            })

            window.location.href = '/seller/dashboard'
        })
    } catch (err) {
        console.log("ERR", err)
    }
  }

  return (
    <div className="d-flex display-1 justify-content-center p-5">
      <LoadingOutlined className="h1 p-5 text-danger" />
    </div>
  );
};

export default StripeCallback;
