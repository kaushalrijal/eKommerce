import { APP_NAME } from "@/lib/constants"

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
        <div className="p-4 flex-center">
            &copy; {currentYear} {APP_NAME}. All Rights Reserved
        </div>
    </footer>
  )
}

export default Footer