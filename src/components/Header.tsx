interface HeaderProps {
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ setIsAdding }: HeaderProps) => {
  return (
    <header>
      <h1 style={{ cursor: "pointer" }}>To-do List</h1>
      <div style={{ marginTop: "30px", marginBottom: "18px" }}>
        <button className="add-button" onClick={() => setIsAdding(true)}>
          Add New Task
        </button>
      </div>
    </header>
  );
};

export default Header;
