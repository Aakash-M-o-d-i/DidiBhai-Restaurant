
export default function DeviceFrame({ children }) {
  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="phone-screen hide-scrollbar">
        {children}
      </div>
    </div>
  );
}
