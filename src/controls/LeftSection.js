import Button from './Button';
import './controlsStyle.css';
import logo from '../logo.svg';

export default function LeftSection() {
    const buttonProps = [
        { text: 'pepe1', mode: 'image' },
        { text: 'pepe2', mode: 'image' },
        { text: 'pepe3', mode: 'image' },
        { text: 'pepe4', mode: 'image' }
    ];
    const sectionButtons = buttonProps.map((props) => <Button { ...props }> </Button>);
    // return <menu id='menu-header'> { headerButtons } </menu>
    return <section id='section-left'>
        <div>
            <menu> { sectionButtons } </menu>
            <img src={ logo } />
        </div>
    </section>
}
