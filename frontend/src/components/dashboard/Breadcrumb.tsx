import ArrowRight from "@components/icons/ArrowRight"

interface Props {
  elements: {
    name: string
    href: string
  }[]
}

export default function Breadcrumb(props: Props) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">  
        {
          props.elements.map((element, index) => (
            <li key={element.name} aria-current="page">
              <div className="flex items-center">
                { index > 0 && <ArrowRight /> }
                <a href={element.href} className="ms-1 text-base font-medium md:ms-2 underline" title="function link">
                  {element.name}
                </a>
              </div>
            </li>  
          ))
        }
      </ol>
    </nav>
  )
}