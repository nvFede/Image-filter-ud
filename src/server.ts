import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles, isValidUrl } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  app.get("/filteredimage", async (req: Request, res: Response) => {
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    const imageUrl = req.query.image_url;

    //    1. validate the image_url query
    if (!isValidUrl(imageUrl)) {
      res.status(400).send({ error: "image_url is invalid" });
    }
    //    2. call filterImageFromURL(image_url) to filter the image
    filterImageFromURL(imageUrl)
      .then((filteredImagePath) => {
        //    3. send the resulting file in the response
        res.status(200).sendFile(filteredImagePath, (err) => {
          //    4. deletes any files on the server on finish of the response
          if (err) {
            return res.status(400).send({ message: err });
          } else {
            deleteLocalFiles([filteredImagePath]);
          }
        });
      })
      .catch((error) => {
        return res.status(422).send({ message: error });
      });
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
