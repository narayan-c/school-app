import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Know Your School',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Established in 2015, Parishkaaram Public School is supported and nurtured by
          various accomplished professionals from the fields of education, medicine and engineering.
      </>
    ),
      link: '/know-your-school'
  },
  {
    title: 'Events and Activities',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Following the Gandhian Philosophy of "Educating the Head, Heart and Hands", the school provides a plethora of opportunities for our students to
            explore their talents and interests through various events and activities.
      </>
    ),
      link: '/events-activities'
  },
  {
    title: 'Achievements',
    Svg: require('@site/static/img/achievement.svg').default,
    description: (
        <>
          Our students consistently excel in academics, sports, and extracurricular activities, showcasing their
          dedication to excellence and their commitment to personal growth.
        </>
    ),
    link: '/achievements'
  },
  {
    title: 'Resources',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
        <>
          From the vast ocean of knowledge, that is Internet, we have curated a list of resources that will help students, teachers
          and parents alike in their journey of learning.
        </>
    ),
    link: '/resources'
  }
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={[clsx('col col--3'), styles.featureItem].join(' ')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3 className={styles.title}><a href={link}>{title}</a></h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
