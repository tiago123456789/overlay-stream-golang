function ProgressBar({ healthProgress }) {
  return (
    <div
      style={{ width: `${healthProgress}%` }}
      className="health-bar-progress"
    ></div>
  );
}

export default ProgressBar;
