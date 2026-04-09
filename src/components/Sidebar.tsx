const Sidebar = () => {
  return (
    <div className="drawer" style={{ position: 'relative', zIndex: 1000 }}>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="btn fixed inset-y-44 right-16 font-accent btn-ghost btn-primary drawer-button"
        >
          Table of Contents
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-1/5 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <a href="#top-of-page">Top</a>
          </li>
          <li>
            <a href="#curriculum-exams">Topic</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
