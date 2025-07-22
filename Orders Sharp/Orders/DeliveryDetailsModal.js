import React, { useCallback, useReducer, useState } from "react";
import ModalComponent from "../../components/Modals/modal";
import arrow_down from "../../assets/icons/arrow_down.svg";
import { useDispatch } from "react-redux";
import { updateDeliveryAddress } from "../../redux/Orders/ordersAction";
import { getAllLGA, getAllState } from "../../redux/Location/locationAction";
import cogoToast from "cogo-toast";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SearchComponent from "../../components/Search";

const DeliveryDetailsModal = ({
  deliveryDetailsModal,
  showDeliveryDetailsModal,
  setDeliveryDetailsModal,
  setDeliveryDetails,
  deliveryDetails,
  id,
}) => {
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [stateSearchValue, setStateSearchValue] = useState("");
  const [lgaSearchValue, setLgaSearchValue] = useState("");
  const [duplicatedStateData, setDuplicatedStateData] = useState([]);
  const [lgaData, setLgaData] = useState([]);
  const [duplicatedLgaData, setDuplicatedLgaData] = useState([]);
  const [clickState, updateClickState] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      isLanguageClick: false,
      isGenderClick: false,
      isStateClick: false,
      isLGAClick: false,
      isCropsClick: false,
      isLivestockClick: false,
      isCooperativeClick: false,
    }
  );

  const [selectedValue, updateSelectedValue] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      selectedLanguage: {},
      selectedGender: {},
      selectedState: {},
      selectedLGA: {},
      // selectedCrops: {},
      selectedCooperative: {},
    }
  );

  const handleStateClick = () => {
    dispatch(getAllState()).then((res) => {
      setStateData(res?.payload?.states);
      setDuplicatedStateData(res?.payload?.states);
    });
    updateClickState({
      isStateClick: !clickState.isStateClick,
    });
  };
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;

    if (name === "estimatedDate") {
      const daysToAdd = parseInt(value, 10);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysToAdd);

      setDeliveryDetails((prev) => ({
        ...prev,
        [name]: value,
        expectedDeliveryDate: futureDate.toISOString().split("T")[0], // Stores YYYY-MM-DD format
      }));
    } else {
      setDeliveryDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectedState = (data) => {
    updateSelectedValue({ selectedState: { key: data.id, label: data.name } });
    updateClickState({ isStateClick: false });

    dispatch(
      getAllLGA({
        id: data.id,
      })
    ).then((res) => {
      setLgaData(res?.payload?.lgas);
      setDuplicatedLgaData(res?.payload?.lgas);
    });

    setDeliveryDetails((prev) => ({
      ...prev,
      state: data.id,
    }));
  };

  const handleSearchStateChange = useCallback(
    (e) => {
      let val = e.target.value;
      setStateSearchValue(val);
      let data = duplicatedStateData;

      let filteredData = data.filter((state) =>
        state?.name?.toLowerCase().includes(val?.toLowerCase())
      );
      setStateData(filteredData);
    },
    [duplicatedStateData, setStateSearchValue]
  );

  const handleSearchLgaChange = useCallback(
    (e) => {
      let val = e.target.value;
      setLgaSearchValue(val);
      let data = duplicatedLgaData;

      let filteredData = data.filter((lga) =>
        lga?.name?.toLowerCase().includes(val?.toLowerCase())
      );
      setLgaData(filteredData);
    },
    [duplicatedLgaData, setLgaSearchValue]
  );
  const handleLgaClick = () => {
    if (Object.keys(selectedValue?.selectedState).length !== 0) {
      updateClickState({ isLGAClick: !clickState.isLGAClick });
    } else {
      cogoToast.error("Kindly select a state first");
    }
  };
  const [loading, setLoading] = useState(false);

  const handleAddDeliveryDetails = () => {
    setLoading(true);
    const data = {
      order_id: Number(id),
      address: deliveryDetails.address,
      estimated_date: deliveryDetails.expectedDeliveryDate,
      delivery_type:
        deliveryDetails.deliveryType === "Doorstep" ? "door_step" : "pick_up",
      state_id: Number(deliveryDetails.state),
      lga_id: Number(deliveryDetails.lga),
      delivery_price: 0,
      notes: "",
    };

    dispatch(updateDeliveryAddress({ data })).then((res) => {
      if (res.type === "updateDeliveryAddress/fulfilled") {
        setLoading(false);
        setDeliveryDetailsModal(false);
      } else if (res.type === "updateDeliveryAddress/rejected") {
        setLoading(false);
      }
    });
  };
  return (
    <div>
      {" "}
      <ModalComponent
        show={deliveryDetailsModal}
        showModal={showDeliveryDetailsModal}
        title="Add Delivery Details"
        subtitle="Confirm the farmer’s delivery details before proceeding. Ensure accuracy to avoid delays."
      >
        <div className="mb-4 mt-4">
          <label className="text-sm font-medium text-[#344335]">Address</label>
          <input
            type="text"
            name="address"
            className="w-full placeholder:text-[#96A397] placeholder:text-sm text-sm placeholder:font-semibold border-[#E1E6E1] bg-white rounded-lg border py-3 px-4 focus:outline-none focus:ring-0 focus:border-[#2B8C34]"
            placeholder="Address"
            value={deliveryDetails.address}
            onChange={handleDeliveryChange}
          />
        </div>

        <div className="mb-4 flex gap-6 justify-between items-center">
          {/* State */}
          <div className="flex-1">
            <div className="relative">
              <p className="font-[400] text-sm leading-[18px] text-[#344335]">
                State
              </p>
              <div
                className="flex items-center cursor-pointer justify-between outline-0 h-[44px] bg-white rounded-[8px] border border-[#E1E6E1] mt-[4px]  px-[14px] w-full font-mdium text-sm leading-5 text-[#96A397] "
                onClick={handleStateClick}
              >
                <p>{selectedValue.selectedState.label || "Select State"}</p>

                {clickState.isStateClick ? (
                  <ExpandLess
                    className="text-[#ABB6AC] cursor-pointer"
                    style={{ fontSize: "18px" }}
                  />
                ) : (
                  <ExpandMore
                    className="text-[#ABB6AC] cursor-pointer"
                    style={{ fontSize: "18px" }}
                  />
                )}
              </div>

              {clickState.isStateClick && (
                <div
                  className="absolute rounded-[8px] p-[8px] w-full bg-white z-20 max-h-[250px] overflow-y-scroll "
                  style={{
                    boxShadow:
                      "0px 0px 1px rgba(0, 0, 0, 0.25), 0px 16px 32px rgba(0, 0, 0, 0.08",
                  }}
                >
                  <div className="">
                    <SearchComponent
                      placeholder="Search..."
                      searchValue={stateSearchValue}
                      handleChange={handleSearchStateChange}
                    />
                  </div>
                  {stateData.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="px-[16px] py-[12px] hover:bg-[#EDF7EE] cursor-pointer"
                        onClick={() => handleSelectedState(data)}
                      >
                        <p className="font-medium text-sm leading-5 text-[#344335]">
                          {data.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* LGA */}
          <div className="flex-1">
            {/* LOCAL GOVERNMENT */}
            <div className="relative">
              <p className="font-medium text-sm leading-[18px] text-[#344335]">
                Local Government Area
              </p>
              <div
                className="flex items-center cursor-pointer justify-between outline-0 h-[44px] bg-white rounded-[8px] border border-[#E1E6E1] mt-[4px]  px-[14px] w-full font-mdium text-sm leading-5 text-[#96A397]"
                onClick={handleLgaClick}
              >
                <p>{selectedValue.selectedLGA.label || "Select LGA"}</p>

                {clickState.isLGAClick ? (
                  <ExpandLess
                    className="text-[#ABB6AC] cursor-pointer"
                    style={{ fontSize: "18px" }}
                  />
                ) : (
                  <ExpandMore
                    className="text-[#ABB6AC] cursor-pointer"
                    style={{ fontSize: "18px" }}
                  />
                )}
              </div>

              {clickState.isLGAClick && (
                <div
                  className="absolute rounded-[8px] p-[8px] w-full bg-white z-20 max-h-[250px] overflow-y-scroll "
                  style={{
                    boxShadow:
                      "0px 0px 1px rgba(0, 0, 0, 0.25), 0px 16px 32px rgba(0, 0, 0, 0.08",
                  }}
                >
                  <div className="">
                    <SearchComponent
                      placeholder="Search..."
                      searchValue={lgaSearchValue}
                      handleChange={handleSearchLgaChange}
                    />
                  </div>
                  {lgaData.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="px-[16px] py-[12px] hover:bg-[#EDF7EE] cursor-pointer"
                        onClick={() => {
                          updateClickState({ isLGAClick: false });
                          setDeliveryDetails((prev) => ({
                            ...prev,
                            lga: data?.id,
                          }));
                          updateSelectedValue({
                            selectedLGA: {
                              key: data?.id,
                              label: data?.name,
                            },
                          });
                        }}
                      >
                        <p className="font-medium text-sm leading-5 text-[#344335]">
                          {data.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Select Delivery Type */}
        <div className="mb-4">
          <label className="text-sm font-medium text-[#344335]">
            Select Delivery Type
          </label>
          <div className="flex flex-col gap-2 mt-3">
            {["Doorstep", "Pickup"].map((type) => (
              <label
                className="text-[#96A397] flex font-semibold items-center cursor-pointer text-sm"
                key={type}
              >
                <input
                  className="w-4 h-4 mr-2"
                  type="radio"
                  name="deliveryType"
                  value={type}
                  checked={deliveryDetails.deliveryType === type}
                  onChange={handleDeliveryChange}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Estimated Delivery Date Dropdown */}
        <div>
          <label className="text-sm font-medium text-[#344335]">
            Estimated Delivery Date
          </label>
          <div className="relative">
            <select
              name="estimatedDate"
              value={deliveryDetails.estimatedDate}
              onChange={handleDeliveryChange}
              className="w-full appearance-none text-[#96A397] text-sm font-semibold border-[#E1E6E1] bg-white rounded-lg border py-3 px-4 focus:outline-none focus:ring-0 focus:border-[#2B8C34]"
            >
              <option value="" disabled selected>
                Select Date
              </option>
              <option className="text-[#344335]" value="3">
                1 - 3 days(fastest available)
              </option>
              <option className="text-[#344335]" value="7">
                4 - 7 days(standard delivery)
              </option>
              <option className="text-[#344335]" value="14">
                8 - 14 days
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <img src={arrow_down} alt="arr-down" className="w-2 h-2" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center mt-8 justify-end gap-5 text-[#4B564D] ">
          {/* Cancel Button */}
          <button
            className="px-5 py-2 text-[#5C715E]"
            onClick={() => {
              setDeliveryDetails({
                address: "",
                state: "",
                lga: "",
                deliveryType: "",
                estimatedDate: "",
              });
              setDeliveryDetailsModal(false);
            }}
          >
            Cancel
          </button>
          <button
            disabled={
              (!deliveryDetails.address &&
                !deliveryDetails.state &&
                !deliveryDetails.lga &&
                !deliveryDetails.deliveryType &&
                !deliveryDetails.estimatedDate) ||
              loading
            }
            className={`px-5 py-2 rounded-lg text-sm font-medium bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-white `}
            onClick={handleAddDeliveryDetails}
          >
            Add Delivery Details
          </button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default DeliveryDetailsModal;
