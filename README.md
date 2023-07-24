

OSM-GPT
=====================================================


https://github.com/rowheat02/osm-gpt/assets/40065760/f43a7a5e-3780-4421-a007-96afe55c683c



Introduction
------------

Welcome to the OSM-GPT, where we leverage the power of GPT-3 and the Overpass API to provide a seamless and intuitive experience for discovering features on OpenStreetMap. This project aims to bridge the gap between natural language queries and querying the OpenStreetMap database, making it easy for users to explore and uncover the treasures hidden within.

Features
--------

-   Natural Language Queries: With the assistance of GPT-3, users can effortlessly express their queries in everyday language, eliminating the need to learn complex query languages or syntax.
-   Overpass API Integration: Our project integrates with the powerful Overpass API, which allows us to fetch features from OpenStreetMap based on the interpreted natural language queries.
-   User-Friendly Interface: Our application provides a user-friendly interface that guides users through the process of submitting queries, viewing results, and navigating the mapped features on OpenStreetMap.


Installation
------------

To run the OpenStreetMap Exploration project, follow these steps:

1.  Clone the project repository from GitHub: `git clone https://github.com/rowheat02/osm-gpt.git`
2.  Install the required dependencies using `npm`: `npm install`
3.  Obtain the necessary API keys and credentials for Openai.
4.  create `.env` file in root directory and update with following variables

```
OPENAI_API_KEY=your_openai_api_key

```
5.  Launch the application by running the main script: `npm run dev` or `npm run build`-> `npm start`
6.  Access the application through your web browser at `http://localhost:3000` or the specified port.

Note: Ensure that you have a stable internet connection to utilize the Overpass API and connect with GPT-3.


Contribution
------------

We welcome contributions to enhance and expand the OpenStreetMap Exploration project. If you have any ideas, bug fixes, or feature enhancements, please submit them as pull requests on our GitHub repository. Together, we can make the OpenStreetMap exploration experience even more powerful and user-friendly.

License
-------

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the codebase according to the terms of this license.

Acknowledgments
----------------

We would like to express our gratitude to OpenAI for providing the GPT-3 technology, as well as the OpenStreetMap community for their valuable contributions and the availability of the Overpass API. Without their support, this project would not have been possible. 
- Initial Openai prompts are inspired from https://github.com/steveattewell/osm-ai-map
- Theme and ui components from shadcnui
- Always Tailwind for css
- Also, kudos to the nextjs team for creating a framework where I can write server and client code at the same time 
  

Contact
-------

If you have any questions, feedback, or suggestions regarding the OSM-GPT, please don't hesitate to contact me at rowheat141@gmail.com I appreciate your interest and look forward to hearing from you.

Happy mapping and exploring with OpenStreetMap!
