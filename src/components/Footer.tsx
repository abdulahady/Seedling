const Footer: React.FC = () => {
  return (
    <footer
      className="footer footer-center p-10 mt-8 rounded-2xl growth-surface"
      style={{
        width: '100%',
      }}
    >
      <aside
        style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <p className="text-emerald-900 font-body font-semibold tracking-wide">
          Copyright Seedling Education - All rights reserved
        </p>
      </aside>
    </footer>
  )
}

export default Footer
