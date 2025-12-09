import { useEffect, useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import AppointmentLetterCommon from "./appointmentLetterCommon";

const PreviewOfferAndAppointment = () => {
  const previewData =
    JSON.parse(localStorage.getItem("offer_letter_preview_data")) || {};
  const templateDescription =
    JSON.parse(localStorage.getItem("template_description")) || {};
  const [webSettingData, setWebSettingData] = useState(null);
  const getConfigData = async () => {
    try {

      let response = await axios.get(`${config.API_URL}getAllSettingData`, apiHeaderToken(config.API_TOKEN))

      if (response.status === 200) {
        setWebSettingData(response?.data?.data)
      } else {
        setWebSettingData(null)
      }

    } catch (error) {
      setWebSettingData(null)
    }
  }

  useEffect(() => {
    getConfigData();
  }, []);


  return (
    <div className="maincontent">
      <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
        <GoBackButton />
        <div className="row">
          <div className="pagename">
            <h3>Preview {previewData?.template_for || previewData?.doc_category}</h3>
          </div>
        </div>
        <AppointmentLetterCommon templateDescription={templateDescription} webSettingData={webSettingData} previewData={previewData} />
      </div>
    </div>
  );
};

export default PreviewOfferAndAppointment;