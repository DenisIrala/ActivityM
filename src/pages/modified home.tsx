<>
  {/* modified home html */}
  <div className="app-container">
    <aside className="sidebar">
      <h2>Navigation</h2>
      <ul className="nav-list">
        <li>Home</li>
        <li>My Lists</li>
        <li>Shared with Me</li>
        <li>Deadlines</li>
        <li>Theme</li>
        <li>Logout</li>
      </ul>
    </aside>
    <main className="main-content">
      <h1>All Your To-Do's</h1>
      <div className="list-container">
        <div className="list-item add-list">
          {/* <button>Add a new list</button> */}
          <div className="button-container">
            <button className="add-list-button">
              <span className="plus-icon">+</span> Add a new list
            </button>
          </div>
        </div>
        {/* Example list items */}
        <div className="list-item">My To-Do List 1</div>
        <div className="list-item">Product Backlog</div>
        <div className="list-item">calc notes v2/20</div>
        <div className="list-item">Mobile dev. Project #2 (Progress)</div>
        <div className="list-item">PROJECT</div>
      </div>
    </main>
  </div>
</>