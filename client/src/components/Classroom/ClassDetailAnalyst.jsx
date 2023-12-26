import { MdOutlineClass } from "react-icons/md";
import { TbSum } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Progress } from "antd";
import rightImg from "../../assets/right.jpg";
const ClassDetailAnalyst = ({ title, data, desc }) => {
  return (
    <div className="w-[30%] h-[8em] relative bg-white  border-[1px] border-gray-200 shadow-xl shadow-purple-100   ">
      <div className="absolute box-primary rounded-full w-1 h-1/2 "></div>
      <div className="absolute box-primary rounded-full w-1/4 h-1 top-0"></div>

      <div className="p-3">
        <div className="flex items-center gap-4 ">
          

          <div className="flex flex-col box-primary text-white w-full py-2 rounded-sm items-center justify-center">
            <h1 className="font-semibold  text-lg font-sans">
              {title}
            </h1>
            <span className="italic  text-sm">{desc}</span>
          </div>
        </div>

        <div className="mt-2">
          {title === "Tiến độ" ? (
            <div className="font-semibold ">
              <Progress percent={data || 0} />
            </div>
          ) : (
            <h3 className="text-3xl font-extrabold text-[#33334F] text-center">
              {data}
            </h3>
          )}
        </div>
      </div>

      {/* <div className="absolute bg-red-500 rounded-full w-1/4 h-1 right-0 bottom-0 "></div>
      <div className="absolute bg-red-500 rounded-full w-1 h-1/2 bottom-0 right-0"></div> */}
    </div>
  );
};

export default ClassDetailAnalyst;
