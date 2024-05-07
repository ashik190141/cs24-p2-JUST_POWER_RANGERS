import PropTypes from 'prop-types';
import MovingText from 'react-moving-text'

const SectionTitle = ({ title, subTitle }) => {
    return (
        <div className="text-center my-5 uppercase">
            <h3>{subTitle}</h3>
            <h1 className="text-4xl font-bold text-red-900">
                <MovingText
                    type="fadeInFromTop"
                    duration="1000ms"
                    delay="0s"
                    direction="normal"
                    timing="ease"
                    iteration="2"
                    fillMode="none">
                    {title}
                </MovingText>
            </h1>
        </div>
    )
}
SectionTitle.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string
}
export default SectionTitle;