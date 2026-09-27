function Navbar() {
    return (
        <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
            <div className="text-lg font-bold">
                Weather Now
            </div>

            <ul className="flex">
                <li className="ml-4">
                    <a href="/" className="hover:underline">
                        Home
                    </a>
                </li>

                <li className="ml-4">
                    <a href="/about" className="hover:underline">
                        About
                    </a>
                </li>

                <li className="ml-4">
                    <a href="/contact" className="hover:underline">
                        Contact
                    </a>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar; 