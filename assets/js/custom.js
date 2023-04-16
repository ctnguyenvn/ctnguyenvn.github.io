let sidebar = document.getElementsByClassName('sidebar_left')[0]
let sidebar_content = document.getElementsByClassName('sidebar-wrapper')[0]

window.onscroll = () => {
    let scrollTop = window.scrollY
    let viewportHeight = window.innerHeight
    let sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset
    let contentHeight = sidebar_content.getBoundingClientRect().height

    if (scrollTop > contentHeight  ) {
        sidebar_content.style.position = 'fixed'
		sidebar_content.style.top = '2rem'
    } else {
        sidebar_content.style.transform = ''
        sidebar_content.style.position = ''
		sidebar_content.style.top = ''
    }
}
